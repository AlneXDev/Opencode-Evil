; OpenCode Evil installer hooks.
; This file is referenced only by the "evil" channel in electron-builder.config.ts,
; so none of it can affect dev/beta/prod builds.

; Declare $pid globally so allowOnlyOneInstallerInstance.nsh (included by
; electron-builder) always sees it regardless of include order. The default
; KILL_PROCESS macro references $pid. Without this declaration, makensis emits
; warning 6000 which electron-builder (-WX) treats as fatal.
Var /GLOBAL pid

!macro customInit
  ; Pin the per-user install root. This runs after initMultiUser and before any
  ; page or section uses $INSTDIR, so a stale InstallLocation left behind by an
  ; older evil build can never redirect the files into the normal OpenCode folder.
  StrCpy $INSTDIR "$LocalAppData\Programs\opencode-evil-desktop"
!macroend

!macro customInstall
  ; Chromium's sandbox needs read/execute access to the installed runtime files.
  ; https://github.com/electron/electron/issues/49143#issuecomment-3618354787
  nsExec::ExecToLog '"$SYSDIR\icacls.exe" "$INSTDIR" /grant "*S-1-15-2-2:(OI)(CI)(RX)"'
  Pop $0

  ; Migration from the first broken evil builds, which shared the normal OpenCode
  ; folder and registered under the GUID derived from ai.opencode.desktop.evil.
  ; Their uninstaller would delete the whole shared folder, so drop that stale
  ; registration and the two evil-owned files. Normal OpenCode files are untouched.
  DeleteRegKey HKCU "Software\2c4dd45c-9ad3-5133-8e1a-0216191596a6"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\2c4dd45c-9ad3-5133-8e1a-0216191596a6"
  Delete "$LocalAppData\Programs\@opencodedesktop\OpenCode Evil.exe"
  Delete "$LocalAppData\Programs\@opencodedesktop\Uninstall OpenCode Evil.exe"
!macroend
