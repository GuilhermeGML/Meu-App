import { IsDateString, IsEmail, IsString } from "class-validator";

export class CreateDeveloperDto {

    @IsString()
    nome: string;

    @IsEmail()
    email: string;

    @IsDateString()
    dateOfBirth: string;
}
