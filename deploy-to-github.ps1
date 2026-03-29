# ==============================================
# سكريبت رفع تطبيق كُـل على GitHub
# شغّل هذا بعد تثبيت Git من https://git-scm.com
# ==============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$GithubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "kull-app"
)

$ErrorActionPreference = "Stop"
$ProjectPath = "C:\Users\tarig\.verdent\verdent-projects\1\kull-app"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  رفع تطبيق كُـل على GitHub" -ForegroundColor Cyan  
Write-Host "========================================`n" -ForegroundColor Cyan

Set-Location $ProjectPath

# 1. تهيئة Git
Write-Host "[1/5] تهيئة Git..." -ForegroundColor Yellow
git init
git config user.name $GithubUsername

# 2. إضافة الملفات
Write-Host "[2/5] إضافة الملفات..." -ForegroundColor Yellow
git add .
git status --short

# 3. أول commit
Write-Host "[3/5] إنشاء أول commit..." -ForegroundColor Yellow
git commit -m "feat: initial commit - kull marketplace app"

# 4. ربط بـ GitHub
Write-Host "[4/5] الربط بـ GitHub..." -ForegroundColor Yellow
$RemoteUrl = "https://github.com/$GithubUsername/$RepoName.git"
git remote add origin $RemoteUrl
git branch -M main

# 5. الرفع
Write-Host "[5/5] رفع الكود..." -ForegroundColor Yellow
git push -u origin main

Write-Host "`n✅ تم الرفع بنجاح!" -ForegroundColor Green
Write-Host "رابط المشروع: https://github.com/$GithubUsername/$RepoName" -ForegroundColor Cyan
Write-Host "`nالخطوات التالية:" -ForegroundColor White
Write-Host "  1. افتح railway.app وانشر الـ Backend من apps/backend"
Write-Host "  2. افتح vercel.com وانشر الـ Frontend من apps/web"
Write-Host "  3. أضف متغيرات البيئة في كلا الخدمتين"
