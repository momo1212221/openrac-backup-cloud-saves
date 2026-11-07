# Backup & Cloud Saves

An independently installed OpenRAC launcher mod, maintained and released from this repository.

## Install

Requires the **momo1212221/OpenRAC fork launcher 1.0.5 or newer**, with the launcher-service bridge. It does not run on unmodified official launchers: their tool pages deliberately cannot run the baker or write saves.

Download `save-backup-sync-0.1.0.zip` from this repository's Releases. In the launcher choose **Mods → Add mod → ZIP**, then open **Backup & Cloud Saves**. The launcher asks for the specific service permission before showing the page. Enable the feature inside the mod. Remove it from the normal mod page to uninstall; existing caches and save archives stay intact. Uninstalling disables automatic work.

## Backups and cloud

Back up and restore game saves and synchronize through a folder you choose. The launcher service checks archive integrity and protects active memory cards. Restoring or choosing a conflicting cloud copy requires confirmation. The cloud application (or Syncthing/NAS) synchronizes the folder; this mod does not sign into a provider or enable system iCloud. Cloud configuration and automatic before/after-play synchronization are independent of graphics.

## Develop

`node --test` runs dependency-free controller tests. `python3 tools/package.py` creates a deterministic installable ZIP and SHA256SUMS. The UI is sandboxed and uses the documented `service` message with a fixed operation allowlist. No terminal command or arbitrary filesystem path is accepted. This repository contains no game, disc, model weights or save data.

GPL-3.0-or-later. Derived from the user's OpenRAC fork; underlying host services remain in that GPL project.
