.PHONY: start stop dev web api test lint typecheck db-up migrate seed e2e build

start:
	./start.sh

stop:
	./stop.sh

dev:
	docker compose up --build

web:
	npm --workspace apps/web run dev

api:
	cd apps/api && uvicorn app.main:app --reload --port 8000

test:
	npm test && cd apps/api && pytest

lint:
	npm run lint

typecheck:
	npm run typecheck

db-up:
	docker compose up -d postgres redis

migrate:
	cd apps/api && alembic upgrade head

seed:
	cd apps/api && python -m app.seed

e2e:
	npm --workspace apps/web run e2e

build:
	npm run build
