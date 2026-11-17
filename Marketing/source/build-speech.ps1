$ErrorActionPreference = 'Stop'
$marketingRoot = Split-Path -Parent $PSScriptRoot
$data = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'collateral.json') -Raw | ConvertFrom-Json
Add-Type -AssemblyName System.Speech
$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice.SelectVoice('Microsoft Zira Desktop')
$voice.Rate = -1
$voice.Volume = 100
try {
    for ($i=0; $i -lt $data.video.Count; $i++) {
        $name = 'voice-{0:d2}.wav' -f ($i+1)
        $voice.SetOutputToWaveFile((Join-Path $marketingRoot "video/$name"))
        $voice.Speak($data.video[$i].narration)
        $voice.SetOutputToNull()
    }
} finally { $voice.Dispose() }
Write-Output 'Created eight local synthetic narration files.'
