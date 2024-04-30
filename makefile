run:
	gcloud functions deploy backend --runtime nodejs18 --trigger-http --entry-point app
set: 
	export GOOGLE_APPLICATION_CREDENTIALS="/home/diani/Downloads/soa-gr6-p3-c59dcdd7fa7a.json"
	gcloud config set project soa-gr6-p3
