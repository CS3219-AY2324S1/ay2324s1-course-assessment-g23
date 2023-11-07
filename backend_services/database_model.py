from dataclasses import dataclass
import psycopg2
import traceback
from fastapi import HTTPException, status


@dataclass
class Database:
    host: str
    port: str
    database: str
    user: str
    password: str

    def _connect(self):
        try:
            conn = psycopg2.connect(
                host = self.host,
                port = self.port,
                database = self.database,
                user = self.user,
                password = self.password)
            return conn
        except Exception as e:
            traceback.print_exc()
            raise e

    def execute_sql_write(self, sql_command: str, params: tuple | None = None):
        conn = self._connect()
        try:
            with conn, conn.cursor() as cur:
                if params:
                    cur.execute(sql_command, params)
                else:
                    cur.execute(sql_command)

                conn.commit()

        except psycopg2.DatabaseError as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def execute_sql_read_fetchone(self, sql_command: str, params: tuple | None = None):
        conn = self._connect()
        try:
            with conn, conn.cursor() as cur:
                if params:
                    cur.execute(sql_command, params)
                else:
                    cur.execute(sql_command)
                return cur.fetchone()

        except psycopg2.DatabaseError as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def execute_sql_read_fetchall(self, sql_command: str, params: tuple | None = None):
        conn = self._connect()
        try:
            with conn, conn.cursor() as cur:
                if params:
                    cur.execute(sql_command, params)
                else:
                    cur.execute(sql_command)
                return cur.fetchall()

        except psycopg2.DatabaseError as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))