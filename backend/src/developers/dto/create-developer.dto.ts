import { IsEmail, IsString, Matches } from "class-validator";

export class CreateDeveloperDto {

    @IsString()
    nome: string;

    @IsEmail()
    email: string;

    @IsString()
    cpf: string;
}
