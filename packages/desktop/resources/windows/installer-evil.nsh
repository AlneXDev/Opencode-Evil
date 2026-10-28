; OpenCode Evil installer hooks.
; This file is referenced only by the "evil" channel in electron-builder.config.ts,
; so none of it can affect dev/beta/prod builds.

!macro customInit
  ; Pin the per-user install root. This runs after initMultiUser and before any
  ; page or section uses $INSTDIR, so a stale InstallLocation left behind by an
  ; older evil build can never redirect the files into the normal OpenCode folder.
  StrCpy $INSTDIR "$LocalAppData\Programs\opencode-evil-desktop"
!macroend

; Override the default app-running check to avoid $pid issues and only target OpenCode Evil.exe
!macro _CHECK_APP_RUNNING
  !ifmacrodef FIND_PROCESS
    !insertmacro FIND_PROCESS "OpenCode Evil.exe" $R0
    ${if} $R0 == 0
      MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "OpenCode Evil is running. Please close it and try again." /SD IDOK IDOK 0
      Quit
      doStopProcessEvil:
      DetailPrint "Closing OpenCode Evil..."
      nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /F /IM "OpenCode Evil.exe"'
      Pop $0
      Sleep 1000
      !insertmacro FIND_PROCESS "OpenCode Evil.exe" $R0
      ${if} $R0 == 0
        Goto doStopProcessEvil
      ${endIf}
    ${endIf}
  !else
    nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /F /IM "OpenCode Evil.exe"'
    Pop $0
    Sleep 500
  !endif
!macroend

!macro CHECK_APP_RUNNING
  Var /GLOBAL CmdPath
  Var /GLOBAL PowerShellPath
  StrCpy $CmdPath "$SYSDIR\cmd.exe"
  StrCpy $PowerShellPath "$SYSDIR\WindowsPowerShell\v1.0\powershell.exe"
  !insertmacro _CHECK_APP_RUNNING
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
