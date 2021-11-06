from datetime import datetime, timedelta
from typing import Optional
from .baseimports import *
from fastapi import Depends, FastAPI, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


fake_users_db = {
    "33b5ea20-3a5c-11ec-8d3d-0242ac130003": {
        "username": "admin",
        "full_name": "Administrator",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$aUfjHy3j5i0Jlwrji2ns9eVKsEPuzkfhAulUenOCauBD1C6yX3oKG",
        "disabled": False,
    }
}


class Token(BaseModel):
    access_token: str
    detail: str


class TokenData(BaseModel):

    uuid: Optional[str] = None


class User(BaseModel):
    uuid: str
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    hashed_password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_auth_user(db, uuid: str):
    if uuid in db:
        user_dict = db[uuid]
        return UserInDB(**user_dict)


def get_user(db, username: str):
    uuid = uuidToUser(username)
    if uuid in db:
        user_dict = db[uuid]
        user_dict["uuid"] = uuid
        return UserInDB(**user_dict)


def uuidToUser(username: str):
    for e in fake_users_db:
        if fake_users_db[e]["username"] == username:
            return e


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uuid: str = payload.get("sub")
        if uuid is None:
            raise credentials_exception
        token_data = TokenData(uuid=uuid)
    except JWTError:
        raise credentials_exception
    user = get_auth_user(fake_users_db, uuid=token_data.uuid)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@webapp.get("/login")
async def login(request: Request):
    global MAIN_FRAME
    path = "/login"
    page = path[1:]
    return templates.TemplateResponse(
        page + ".htm",
        {
            "request": request,
            "SIDE_BAR": SIDE_BAR,
            "path": path,
            "pTitle": page,
        },
    )


@webapp.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.uuid}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "detail": "Authentication successful!"}


@webapp.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@webapp.get("/users/me/items/")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.username}]
