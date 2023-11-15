build:
	npx lerna run build
run:
	dapr dashboard && dapr run -f .
postgres_up:
	docker run -d --name koot -p 5432:5432 -e POSTGRES_PASSWORD=root postgres