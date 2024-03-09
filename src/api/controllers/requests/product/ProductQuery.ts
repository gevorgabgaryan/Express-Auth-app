import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class ProductQuery {

    @IsNumber()
    @IsNotEmpty()
    page: number;

    @IsNumber()
    @IsNotEmpty()
    itemsPerPage: number;

    @IsString()
    @IsOptional()
    keyword: string;
}