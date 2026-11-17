# Editable sources and build steps

The pack uses local website statements and existing documentation illustrations. The source data is in `collateral.json`. Use Markdown files for copy edits and SVG files for design edits. The sales deck keeps text editable in PowerPoint.

## Tools

Use the Codex workspace dependency loader to find the bundled Node and Python runtimes. Set `DEPLOYZ_RUNTIME_ROOT` to the returned `dependencies` directory for the deck builder. Use the bundled package directory through the `.build/node_modules` junction.

The PDF builder uses ReportLab, pypdf, fonttools, and brotli. The video builder uses imageio-ffmpeg. Task-local extra Python packages are in `.build/python-deps`. Set `PYTHONPATH` to that directory before running the Python builders. These dependencies are not part of the distribution ZIP.

## Build order

1. Run `build-assets.mjs` with the bundled Node runtime.
2. Run `build-pdfs.py` with the bundled Python runtime.
3. Run `build-deck.mjs` with the bundled Node runtime. Use a new final output and receipt name for each revision. The finalizer will not overwrite an existing final file.
4. Run `build-speech.ps1` in Windows PowerShell to create local narration.
5. Run `build-video.py` with the bundled Python runtime.
6. Run `review-pdfs.py` to export the visual slide PDF and render all PDFs.
7. Inspect the rendered pages, slides, graphics, and video frames.
8. Run `package-assets.py` to update the gallery, inventory, checksums, and ZIP.

The PDF slide export contains rendered slide images. Use the PPTX to select or edit slide text. Other PDF documents contain selectable text.

The screenshot builder can use private source captures in `.build/captures`. The distribution ZIP excludes that folder. If private captures are absent, existing safe screenshots remain unchanged.

No website or app source code is changed by these builders. No command publishes or sends the material.
