from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    user_id: int
    name: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    model_config = {"from_attributes": True}
