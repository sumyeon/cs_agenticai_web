Add-Type -AssemblyName System.Drawing
$brandDir=Join-Path $PSScriptRoot '..\public\brand'
New-Item -ItemType Directory -Path $brandDir -Force | Out-Null
$regular=[System.Drawing.FontFamily]::new('Segoe UI')
$semibold=[System.Drawing.FontFamily]::new('Segoe UI Semibold')
$format=[System.Drawing.StringFormat]::GenericTypographic
$pieces=@()
$x=0.0
foreach($piece in @(@('lubr',$regular,'base'),@('AI',$semibold,'ai'),@('n',$regular,'base'))){
 $path=[System.Drawing.Drawing2D.GraphicsPath]::new()
 $path.AddString($piece[0],$piece[1],0,108,[System.Drawing.PointF]::new([float]$x,0),$format)
 $bounds=$path.GetBounds()
 $pieces+=@{Path=$path;Kind=$piece[2]}
 $x=$bounds.Right+1.4
}
$all=[System.Drawing.Drawing2D.GraphicsPath]::new()
foreach($part in $pieces){$all.AddPath($part.Path,$false)}
$bounds=$all.GetBounds()
$shift=[System.Drawing.Drawing2D.Matrix]::new()
$shift.Translate([float](5-$bounds.Left),[float](5-$bounds.Top))
foreach($part in $pieces){$part.Path.Transform($shift)}
$vw=[math]::Ceiling($bounds.Width+10)
$vh=[math]::Ceiling($bounds.Height+10)
function N($v){return ([double]$v).ToString('0.###',[System.Globalization.CultureInfo]::InvariantCulture)}
function PathData($p){
 $points=$p.PathPoints; $types=$p.PathTypes; $d=''
 for($i=0;$i -lt $points.Length;$i++){
  $t=$types[$i] -band 7
  if($t -eq 0){$d+='M'+(N $points[$i].X)+' '+(N $points[$i].Y)}
  elseif($t -eq 1){$d+='L'+(N $points[$i].X)+' '+(N $points[$i].Y)}
  elseif($t -eq 3){$d+='C'+(N $points[$i].X)+' '+(N $points[$i].Y)+' '+(N $points[$i+1].X)+' '+(N $points[$i+1].Y)+' '+(N $points[$i+2].X)+' '+(N $points[$i+2].Y);$i+=2}
  if(($types[$i] -band 128) -ne 0){$d+='Z'}
 }
 return $d
}
foreach($variant in @(@('lubrain.svg','#243735','#307A73'),@('lubrain-inverse.svg','#F1F3E9','#9EC9BC'),@('lubrain-mono.svg','#243735','#243735'))){
 $svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+$vw+' '+$vh+'" role="img" aria-label="lubrAIn"><title>lubrAIn</title>'
 foreach($part in $pieces){$color=if($part.Kind -eq 'ai'){$variant[2]}else{$variant[1]};$svg+='<path fill="'+$color+'" d="'+(PathData $part.Path)+'"/>'}
 $svg+='</svg>'
 [System.IO.File]::WriteAllText((Join-Path $brandDir $variant[0]),$svg,[System.Text.UTF8Encoding]::new($false))
}
$bmp=[System.Drawing.Bitmap]::new(1400,780)
$g=[System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.ColorTranslator]::FromHtml('#F8F8F3'))
$ink=[System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#243735'))
$muted=[System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#60746D'))
$g.DrawString('lubrAIn / WORDMARK',[System.Drawing.Font]::new('Segoe UI',13),$muted,70,42)
$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#192B2C')),720,115,610,385)
foreach($v in @(@(95,230,1.45,'#243735','#307A73'),@(760,230,1.45,'#F1F3E9','#9EC9BC'))){
 foreach($part in $pieces){$p=$part.Path.Clone();$m=[System.Drawing.Drawing2D.Matrix]::new();$m.Scale([float]$v[2],[float]$v[2]);$p.Transform($m);$m=[System.Drawing.Drawing2D.Matrix]::new();$m.Translate([float]$v[0],[float]$v[1]);$p.Transform($m);$color=if($part.Kind -eq 'ai'){$v[4]}else{$v[3]};$g.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($color)),$p);$p.Dispose()}
}
$g.DrawString('PRIMARY / LIGHT',[System.Drawing.Font]::new('Segoe UI',10),$muted,95,434)
$g.DrawString('REVERSED / DARK',[System.Drawing.Font]::new('Segoe UI',10),[System.Drawing.Brushes]::LightGray,760,434)
$g.DrawString('lubricant + brain',[System.Drawing.Font]::new('Segoe UI',23),$ink,70,555)
$g.DrawString('One word. A quiet emphasis on AI.',[System.Drawing.Font]::new('Segoe UI',14),$muted,70,610)
$g.DrawString('지식과 지혜를 부드럽게 연결합니다.',[System.Drawing.Font]::new('Malgun Gothic',15),$muted,70,657)
foreach($item in @(@(910,'#243735'),@(1040,'#307A73'),@(1170,'#9EC9BC'))){$brush=[System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($item[1]));$g.FillRectangle($brush,[int]$item[0],565,105,50);$g.DrawString($item[1],[System.Drawing.Font]::new('Segoe UI',10),$muted,[int]$item[0],627)}
$bmp.Save((Join-Path $brandDir 'lubrain-wordmark-preview.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$bmp.Dispose()
Write-Output "Generated outlined SVG wordmarks and PNG preview ($vw x $vh SVG viewBox)."

