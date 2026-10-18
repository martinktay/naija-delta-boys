param(
    [string]$TerrainSheet = "assets/references/canonical_v5/terrain_paths_water_jetties.png",
    [string]$OutputDirectory = "public/assets/naija-delta-boys/terrain-v5"
)

Add-Type -AssemblyName System.Drawing.Common
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

function Export-Crop([string]$Name, [int]$X, [int]$Y, [int]$Width, [int]$Height) {
    $source = [System.Drawing.Bitmap]::new((Resolve-Path -LiteralPath $TerrainSheet).Path)
    $target = [System.Drawing.Bitmap]::new($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
        $graphics = [System.Drawing.Graphics]::FromImage($target)
        try {
            $graphics.Clear([System.Drawing.Color]::Transparent)
            $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, $Width, $Height), [System.Drawing.Rectangle]::new($X, $Y, $Width, $Height), [System.Drawing.GraphicsUnit]::Pixel)
        }
        finally { $graphics.Dispose() }
        $path = Join-Path $OutputDirectory $Name
        $target.Save($ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($path), [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally { $target.Dispose(); $source.Dispose() }
}

# Calibrated non-overlapping regions from the user-supplied canonical sheet.
Export-Crop "dirt-road-straight.png" 20 8 320 205
Export-Crop "dirt-road-corner.png" 335 8 300 205
Export-Crop "dirt-road-t-junction.png" 625 8 300 215
Export-Crop "dirt-road-crossing.png" 920 8 330 220
Export-Crop "sandy-footpath.png" 10 222 300 205
Export-Crop "shoreline-transition.png" 934 420 310 205
Export-Crop "deep-water.png" 635 620 315 215
Export-Crop "wooden-bridge.png" 420 820 365 225
Export-Crop "wooden-boardwalk.png" 825 810 425 245
