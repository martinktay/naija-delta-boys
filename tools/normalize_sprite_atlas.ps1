param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$OutputPath,
    [Parameter(Mandatory = $true)][int]$Width,
    [Parameter(Mandatory = $true)][int]$Height
)

Add-Type -AssemblyName System.Drawing.Common
$source = [System.Drawing.Bitmap]::new((Resolve-Path -LiteralPath $InputPath).Path)
$target = [System.Drawing.Bitmap]::new($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
try {
    $graphics = [System.Drawing.Graphics]::FromImage($target)
    try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($source, 0, 0, $Width, $Height)
    }
    finally { $graphics.Dispose() }
    $target.Save($ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath), [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
    $target.Dispose()
    $source.Dispose()
}
