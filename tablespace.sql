-- Cria tablespace tbs_course
create tablespace [TBS_NAME]
datafile '/u01/app/oracle/oradata/XE/[TBS_NAME].dbf' size 10M reuse
autoextend on next 1M maxsize 200M
online;

-- Cria o usuario course
create user [USERNAME] --usuario
identified by "[PASSWORD]"  --senha
default tablespace [TBS_NAME]
temporary tablespace temp;

-- Cria a "role" do curso
create role [ROLE_NAME];

-- define os privilegios da "role" do curso
grant
create cluster,
create database link,
create procedure,
create session,
create sequence,
create synonym,
create table,
create any type,
create trigger,
create view
to [ROLE_NAME];

-- atribui a "role" ao usuario
grant [ROLE_NAME] to [USERNAME];

-- define "unlimited" tablespace para o usuario
grant unlimited tablespace to [USERNAME];