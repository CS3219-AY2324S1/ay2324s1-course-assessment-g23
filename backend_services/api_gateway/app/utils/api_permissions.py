# Permission values of higher value is a superset of any permission with lower value
# i.e Maintainer can do anything that a user can do
from typing import Literal, TypeAlias

PermissionLevel: TypeAlias = Literal[0, 1, 2]
PUBLIC_PERMISSION: PermissionLevel = 0
USER_PERMISSION: PermissionLevel = 1 # Account owner's permission (e.g a logged in user only has permission of their OWN personal account)
MAINTAINER_PERMISSION: PermissionLevel = 2


Method: TypeAlias = Literal["POST", "GET", "DELETE", "PUT"]
PERMISSIONS_TABLE: dict[str, dict[Method, PermissionLevel]] = {
    "users": {
        "POST": PUBLIC_PERMISSION,
        "GET": PUBLIC_PERMISSION,
        "DELETE": USER_PERMISSION,
        "PUT": USER_PERMISSION
        },
    "users_all": {
        "GET": MAINTAINER_PERMISSION,
        "DELETE": MAINTAINER_PERMISSION
        },
    "users_role": {
        "PUT": MAINTAINER_PERMISSION
        },
    "sessions": {
        "POST": PUBLIC_PERMISSION,
        "GET": PUBLIC_PERMISSION, # for login persistence, and session_id should be implicitly already be secret to user
        "DELETE": PUBLIC_PERMISSION, # no validation needed to logout
        },
    "sessions_all":{
        "GET": MAINTAINER_PERMISSION,
        "DELETE": MAINTAINER_PERMISSION
        },
    "questions": {
        "POST": MAINTAINER_PERMISSION,
        "GET": USER_PERMISSION,
        "DELETE": MAINTAINER_PERMISSION,
        "PUT": MAINTAINER_PERMISSION
        },
    "questions_all":{
        "GET": USER_PERMISSION,
        "DELETE": MAINTAINER_PERMISSION
    }
}

