# coding: utf-8
"""
"""
__author__ = 'Nikola Klaric (nikola@generic.company)'
__copyright__ = 'Copyright (c) 2013-2014 Nikola Klaric'

import uuid
from collections import namedtuple

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.types import TypeDecorator, CHAR

Base = declarative_base()

def createNamedTuple(*values):
    return namedtuple('NamedTuple', values)(*values)


def createUuid():
    return uuid.uuid4().hex


class GUID(TypeDecorator):

    impl = CHAR

    def load_dialect_impl(self, dialect):
        return dialect.type_descriptor(CHAR(32))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        else:
            if not isinstance(value, uuid.UUID):
                return '%.32x' % uuid.UUID(value)
            else:
                return '%.32x' % value

    def process_result_value(self, value, dialect):
        return uuid.UUID(value) if value is not None else None
