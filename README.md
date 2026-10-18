# EL Journal

EL Journal is a static HTML, CSS, and JavaScript blog deployed on Vercel. Published posts and their images are project files. Firebase Authentication protects the admin area; Cloud Firestore stores author profile settings and categories.

## Publish a post

1. Put the image file in `assets/images/posts/`.
2. Add a post object to `initialData.posts` in `assets/js/data.js`. Keep `id` unique and `slug` stable, set `publishedAt` to an ISO date such as `2026-10-18`, and add a short `tags` array. Set `coverImage` to a root-relative path such as `assets/images/posts/example.webp`.
3. Set `status` to `Draft` while preparing the article. Change it to `Published` when ready.
4. Preview at `blog-detail.html?slug=<slug>` and check the listing and homepage.
5. Commit and push the project files to the connected Vercel repository. The deployment publishes the post and image together.

The Admin Post Editor page explains this workflow but does not write project files. Browser uploads cannot modify the repository or a Vercel deployment. The Media Library's Prepare Image action downloads a selected image so it can be added to the project.

## Firebase

Firebase Authentication is used for admin sign-in. Firestore holds the author document at `site_settings/author` and the `categories` collection. Blog post reads and writes are not part of the publishing path.

`firebase.json` points to `firestore.rules`. Deploy rule changes with:

```powershell
firebase deploy --only firestore:rules --project el-journal-blogsite
```

The Firebase web configuration in `assets/js/firebase-client.js` is public client configuration. Do not add service-account keys or private credentials to browser files or the repository.

## Local preview

Serve the project root with any static HTTP server, then open `index.html`. A static server is needed for browser ES modules and Firebase profile/category features.
