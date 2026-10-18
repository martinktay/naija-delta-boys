param(
  [string]$Source = "public/assets/naija-delta-boys/ads/creekconnect_demo.png",
  [string]$Output = "public/assets/naija-delta-boys/ads/creekconnect_perspective.png"
)

Add-Type -AssemblyName System.Drawing
$sourcePath = (Resolve-Path $Source).Path
$targetPath = Join-Path (Get-Location) $Output
$src = [System.Drawing.Bitmap]::FromFile($sourcePath)
$dst = [System.Drawing.Bitmap]::new(190,260,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Calibrated to the transparent billboard-frame sprite's inner display surface.
$topLeft = [System.Drawing.PointF]::new(24,38)
$topRight = [System.Drawing.PointF]::new(169,32)
$bottomLeft = [System.Drawing.PointF]::new(25,150)
$graphics = [System.Drawing.Graphics]::FromImage($dst)
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.DrawImage($src,[System.Drawing.PointF[]]@($topLeft,$topRight,$bottomLeft))
$graphics.Dispose()

$dst.Save($targetPath,[System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$dst.Dispose()
Write-Output $targetPath
