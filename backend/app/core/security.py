from passlib.context import CryptContext

# Although Supabase handles password verification, having the context
# available is good practice if we ever need to handle passwords in the backend.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Security:
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

security = Security() 