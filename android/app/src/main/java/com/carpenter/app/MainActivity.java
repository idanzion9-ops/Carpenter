package com.carpenter.app;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.KeyEvent;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler;

import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Carpenter runs as a web app inside a WebView, served from a fixed origin
 * (https://appassets.androidplatform.net) by WebViewAssetLoader.
 *
 * Two things follow from that fixed origin:
 *
 *   1. The app's web files can be swapped underneath it — from the APK's own
 *      assets on first run, from internal storage once an update has been
 *      downloaded — without the browser ever seeing a different site.
 *   2. Everything the user has saved (tools owned, dimensions, notes, personal
 *      projects, all in localStorage) belongs to that origin and therefore
 *      survives both content updates and APK updates. Nothing is ever reset.
 *
 * Updates arrive two ways:
 *   - Content updates: checked on every launch against version.json in the
 *     repository, downloaded as a zip, unpacked, applied on the spot.
 *   - APK updates: only needed when this shell itself changes. Because the APK
 *     is always signed with the same committed key, Android installs it over
 *     the existing app and keeps its data.
 */
public class MainActivity extends Activity {

    private static final String DOMAIN = "appassets.androidplatform.net";
    private static final String ORIGIN = "https://" + DOMAIN;
    private static final String PREFS = "carpenter";
    private static final String KEY_CONTENT_VERSION = "contentVersion";

    private WebView web;
    private WebViewAssetLoader loader;
    private SharedPreferences prefs;
    private final Handler ui = new Handler(Looper.getMainLooper());
    private boolean checking = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences(PREFS, MODE_PRIVATE);

        loader = new WebViewAssetLoader.Builder()
                .setDomain(DOMAIN)
                .addPathHandler("/", new HybridPathHandler())
                .build();

        web = new WebView(this);
        web.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setUserAgentString(s.getUserAgentString() + " CarpenterApp/" + appVersion());

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (u.getHost() != null && u.getHost().equals(DOMAIN)) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, u));
                } catch (Exception ignored) {
                }
                return true;
            }
        });

        web.addJavascriptInterface(new Bridge(), "Carpenter");
        web.loadUrl(ORIGIN + "/index.html");

        checkForContentUpdate(false);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        checkForContentUpdate(false);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && web != null && web.canGoBack()) {
            web.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    /* ---------------- what the web app can call ---------------- */

    private class Bridge {
        @JavascriptInterface
        public String appVersion() {
            return MainActivity.this.appVersion();
        }

        @JavascriptInterface
        public String contentVersion() {
            return prefs.getString(KEY_CONTENT_VERSION, "");
        }

        @JavascriptInterface
        public void checkForUpdate() {
            checkForContentUpdate(true);
        }
    }

    private String appVersion() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "1.0";
        }
    }

    /* ---------------- serving the web app ---------------- */

    private File webDir() {
        return new File(getFilesDir(), "web");
    }

    private class HybridPathHandler implements WebViewAssetLoader.PathHandler {
        private final AssetsPathHandler assets = new AssetsPathHandler(MainActivity.this);

        @Nullable
        @Override
        public WebResourceResponse handle(String path) {
            if (path == null) path = "";
            if (path.isEmpty() || path.endsWith("/")) path = path + "index.html";

            File dir = webDir();
            try {
                File f = new File(dir, path);
                if (dir.isDirectory() && f.isFile()
                        && f.getCanonicalPath().startsWith(dir.getCanonicalPath())) {
                    return new WebResourceResponse(mime(path), null, new FileInputStream(f));
                }
            } catch (IOException ignored) {
            }
            // Fall back to the copy bundled inside the APK.
            return assets.handle("www/" + path);
        }
    }

    private static String mime(String path) {
        String p = path.toLowerCase();
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".js")) return "text/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".json") || p.endsWith(".webmanifest")) return "application/json";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".woff2")) return "font/woff2";
        return "text/plain";
    }

    /* ---------------- over-the-air content updates ---------------- */

    private void checkForContentUpdate(final boolean manual) {
        if (checking) return;
        checking = true;
        if (manual) toast("Checking for a new version…");

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String owner = getString(R.string.repo_owner);
                    String repo = getString(R.string.repo_name);
                    String branch = getString(R.string.repo_branch);

                    String meta = download("https://raw.githubusercontent.com/"
                            + owner + "/" + repo + "/" + branch + "/version.json");
                    String remote = new JSONObject(meta).optString("version", "");
                    String local = prefs.getString(KEY_CONTENT_VERSION, "");

                    boolean haveFiles = new File(webDir(), "index.html").isFile();
                    if (remote.isEmpty() || (remote.equals(local) && haveFiles)) {
                        if (manual) toast("You are on the latest version");
                        return;
                    }

                    File staging = new File(getFilesDir(), "web-staging");
                    deleteTree(staging);
                    if (!staging.mkdirs()) throw new IOException("Cannot create staging folder");

                    unzipInto("https://codeload.github.com/" + owner + "/" + repo
                            + "/zip/refs/heads/" + branch, staging);

                    if (!new File(staging, "index.html").isFile()) {
                        throw new IOException("Downloaded update has no index.html");
                    }

                    File live = webDir();
                    deleteTree(live);
                    if (!staging.renameTo(live)) throw new IOException("Cannot install update");

                    prefs.edit().putString(KEY_CONTENT_VERSION, remote).apply();

                    final String v = remote;
                    ui.post(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this,
                                    "Updated to " + v, Toast.LENGTH_LONG).show();
                            if (web != null) web.loadUrl(ORIGIN + "/index.html");
                        }
                    });
                } catch (Exception e) {
                    if (manual) toast("Update check failed: " + e.getMessage());
                } finally {
                    checking = false;
                }
            }
        }).start();
    }

    private String download(String url) throws IOException {
        HttpURLConnection c = open(url);
        try {
            InputStream in = new BufferedInputStream(c.getInputStream());
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toString("UTF-8");
        } finally {
            c.disconnect();
        }
    }

    /** Unpacks the repository zip, dropping its top folder and anything that isn't web content. */
    private void unzipInto(String url, File target) throws IOException {
        HttpURLConnection c = open(url);
        try {
            ZipInputStream zin = new ZipInputStream(new BufferedInputStream(c.getInputStream()));
            ZipEntry entry;
            byte[] buf = new byte[8192];
            while ((entry = zin.getNextEntry()) != null) {
                String name = entry.getName();
                int slash = name.indexOf('/');
                if (slash < 0) continue;
                name = name.substring(slash + 1);           // strip "Carpenter-main/"
                if (name.isEmpty() || name.contains("..")) continue;
                if (name.startsWith("android/") || name.startsWith(".github/")
                        || name.startsWith(".git/")) continue;

                File out = new File(target, name);
                if (entry.isDirectory()) {
                    out.mkdirs();
                    continue;
                }
                File parent = out.getParentFile();
                if (parent != null) parent.mkdirs();
                if (!out.getCanonicalPath().startsWith(target.getCanonicalPath())) continue;

                OutputStream os = new FileOutputStream(out);
                try {
                    int n;
                    while ((n = zin.read(buf)) > 0) os.write(buf, 0, n);
                } finally {
                    os.close();
                }
            }
            zin.close();
        } finally {
            c.disconnect();
        }
    }

    private HttpURLConnection open(String url) throws IOException {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(30000);
        c.setInstanceFollowRedirects(true);
        c.setRequestProperty("User-Agent", "CarpenterApp");
        c.setRequestProperty("Cache-Control", "no-cache");
        if (c.getResponseCode() / 100 != 2) {
            throw new IOException("HTTP " + c.getResponseCode());
        }
        return c;
    }

    private static void deleteTree(File f) {
        if (f == null || !f.exists()) return;
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) deleteTree(k);
        f.delete();
    }

    private void toast(final String msg) {
        ui.post(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
