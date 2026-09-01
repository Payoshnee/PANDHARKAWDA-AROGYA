from app.services import repository

if __name__ == "__main__":
    print(f"Loaded {len(repository.DOCTORS)} fictional demo doctors and {len(repository.FACILITIES)} facilities.")
