CREATE TABLE bitacora_rpa(
	BitacoraID INT PRIMARY KEY IDENTITY,
	Nombre_Proceso VARCHAR(200) NOT NULL,
	Log_Message VARCHAR(200) NOT NULL,
	Status INT NOT NULL,
	Error VARCHAR(200),
	Path_Image VARCHAR(200),
	Create_Time date
);

ALTER TABLE bitacora_rpa ADD CONSTRAINT CK_Status_Range CHECK (Status >=0 AND Status <=1);


CREATE TABLE rpa_users(
	rpaUserID INT IDENTITY(1,1) NOT NULL,
    LoginName NVARCHAR(40) NOT NULL,
    PasswordHash BINARY(64) NOT NULL,
	Salt UNIQUEIDENTIFIER NOT NULL ,
    FirstName NVARCHAR(40) NULL,
    LastName NVARCHAR(40) NULL,
    CONSTRAINT [PK_User_UserID] PRIMARY KEY CLUSTERED (rpaUserID ASC)
)

SELECT * FROM bitacora_rpa


--Begin procedure
ALTER PROCEDURE dbo.uspRpaAddUser
    @pLogin NVARCHAR(50), 
    @pPassword NVARCHAR(50),
    @pFirstName NVARCHAR(40) = NULL, 
    @pLastName NVARCHAR(40) = NULL
   -- @responseMessage NVARCHAR(250) OUTPUT
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @salt UNIQUEIDENTIFIER=NEWID()
    BEGIN TRY

        INSERT INTO dbo.rpa_users (LoginName, PasswordHash, Salt, FirstName, LastName)
        VALUES(@pLogin, HASHBYTES('SHA2_512', @pPassword+CAST(@salt AS NVARCHAR(36))), @salt, @pFirstName, @pLastName)

       --SET @responseMessage='Success'

    END TRY
    BEGIN CATCH
        --SET @responseMessage=ERROR_MESSAGE() 
    END CATCH

END


--End procedure

--Execute procedure
 EXEC dbo.uspRpaAddUser N'Admin2', N'Admin2', N'Admin2', N'Admin2'
--End Execute
 --Create login procedure
 CREATE FUNCTION funcRpaLogin(
    @pLoginName NVARCHAR(254),
    @pPassword NVARCHAR(50))
	returns NVARCHAR(254)
AS
BEGIN
    DECLARE @rName NVARCHAR(254);

    BEGIN
        SET @rName=(SELECT LoginName FROM [dbo].rpa_users WHERE LoginName=@pLoginName AND PasswordHash=HASHBYTES('SHA2_512', @pPassword+CAST(Salt AS NVARCHAR(36))))
    END
	   return @rName
END


 --End login procedure
select * from rpa_users

--Exec function 
SELECT dbo.funcRpaLogin(
	'Admin',
		 'Admin') AS response

--End exec.
update bitacora_rpa set Path_Image='Screenshot_20180607-112248.png' where BitacoraID=3
Ch@p1ncito

select * from rpa_users
SELECT funcRpaLogin('Admin@Admin','Admin')