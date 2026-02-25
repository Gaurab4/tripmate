"""Custom exception handler: return the same user-facing message for any API/server error."""
from rest_framework.response import Response
from rest_framework import status

GENERIC_ERROR_MESSAGE = "There is some issue and we are resolving it."


def exception_handler(exc, context):
    """Return the same user-facing message for any exception or API error."""
    return Response(
        {"detail": GENERIC_ERROR_MESSAGE},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
