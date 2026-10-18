param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.Drawing.Common
$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
$source = [System.Drawing.Bitmap]::new($resolvedInput)
$bitmap = [System.Drawing.Bitmap]::new($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
try {
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $attributes = [System.Drawing.Imaging.ImageAttributes]::new()
    try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $attributes.SetColorKey([System.Drawing.Color]::FromArgb(170, 0, 170), [System.Drawing.Color]::FromArgb(255, 80, 255))
        $rect = [System.Drawing.Rectangle]::new(0, 0, $source.Width, $source.Height)
        $graphics.DrawImage($source, $rect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
    }
    finally { $attributes.Dispose(); $graphics.Dispose() }
    $bitmap.Save(
        $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath),
        [System.Drawing.Imaging.ImageFormat]::Png
    )
}
finally {
    $bitmap.Dispose()
    $source.Dispose()
}
