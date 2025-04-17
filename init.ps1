npm install
Write-Output "Successfully installed dependencies"

Set-Location .\src
mkdir "data"
Write-Output "Successfully created data folder"

Set-Location .\data
Write-Output [] > "user_data.json"
Write-Output "Successfully created user_data.json"

Set-Location ..\..