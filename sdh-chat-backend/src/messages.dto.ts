
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class SendMessageDto {
  @ApiProperty({ description: 'Socket ID of the recipient' })
  @IsString()
  @IsNotEmpty()
  to!: string

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content!: string
}
