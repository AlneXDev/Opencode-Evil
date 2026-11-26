; OpenCode Eʌil installer hooks.
; Referenced only by the "evil" channel in electron-builder.config.ts,
; so none of this can affect dev/beta/prod builds.

!macro customInit
  ; Pin the per-user install root so a stale InstallLocation can never
  ; redirect the evil install into the normal OpenCode folder.
  StrCpy $INSTDIR "$LocalAppData\Programs\@opencodevil-aidesktop"
!macroend

!macro customCheckAppRunning
  ; Close the evil app and its CLI/PTY helpers. Normal OpenCode.exe is never matched.
  nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /F /IM "OpenCode Eʌil.exe"'
  Pop $0
  nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /F /IM "opencodevil-cli.exe"'
  Pop $0
  nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /F /IM "opencode-pty.exe"'
  Pop $0
  Sleep 500
!macroend

!macro customInstall
  ; Chromium sandbox needs read/execute access to the installed runtime files.
  nsExec::ExecToLog '"$SYSDIR\icacls.exe" "$INSTDIR" /grant "*S-1-15-2-2:(OI)(CI)(RX)"'
  Pop $0
!macroend
