Existing frontends:
https://ts-project-frontend.netlify.app/
https://syenergie.netlify.app/dashboard
https://offsitelab.netlify.app/dashboard

Existing backends:
https://dashboard.heroku.com/apps/tsp
https://dashboard.heroku.com/apps/tsp-syenergie
https://dashboard.heroku.com/apps/tsp-offsitelab

How to push to multiple heroku endpoints:
copy paste the code without node_modules form ts_project server into ts_project_backend
git add .
git commit -m "something"
git push // default
git push heroku-syenergie master // to syenergie
