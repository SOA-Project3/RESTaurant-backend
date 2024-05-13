run:
	gcloud functions deploy backend --runtime nodejs18 --trigger-http --entry-point app --allow-unauthenticated

set: 
	export GOOGLE_APPLICATION_CREDENTIALS="/home/diani/Downloads/soa-gr6-p3-c59dcdd7fa7a.json"
	export keyfile="/home/diani/Downloads/soa-gr6-p3-c59dcdd7fa7a.json"
	set keyfile="C:\Users\dmeji\OneDrive - Estudiantes ITCR\TEC\Semestres\IS2024\SoA\Proyecto_3\soa-gr6-p3-f4af5cd14d29.json"
	gcloud config set project soa-gr6-p3