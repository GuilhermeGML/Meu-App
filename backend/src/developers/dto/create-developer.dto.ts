import { IsString, Matches, IsIn } from "class-validator";

export class CreateDeveloperDto {

    @IsString()
    nome: string;

    @IsString()
    departamento: string;

    @IsString()
    cpf: string;

    @IsIn(['masculino', 'feminino'])
    sexo: string;
}
