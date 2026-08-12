import inspect

import pytest
from fastapi import HTTPException

from app.dependencies.auth import get_current_user, get_current_active_user, require_permission


def test_get_current_user_existe():
    assert callable(get_current_user)


def test_get_current_user_firma():
    sig = inspect.signature(get_current_user)
    assert 'authorization' in sig.parameters
    assert 'db' in sig.parameters


def test_get_current_active_user_existe():
    assert callable(get_current_active_user)


def test_get_current_active_user_firma():
    sig = inspect.signature(get_current_active_user)
    assert 'usuario' in sig.parameters


def test_require_permission_existe():
    assert callable(require_permission)


def test_require_permission_firma():
    sig = inspect.signature(require_permission)
    assert len(sig.parameters) == 1
    assert 'modulo' in sig.parameters


def test_require_permission_retorna_checker():
    checker = require_permission('productos')
    assert callable(checker)
