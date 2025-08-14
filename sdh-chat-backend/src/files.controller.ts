// src/files.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Req, BadRequestException } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import type { Request } from 'express'

const allowed = new Set<string>([
  'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_')

@ApiTags('files')
@Controller('files')
export class FilesController {
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
      ) => cb(null, process.env.UPLOAD_DIR || 'uploads'),
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
      ) => cb(null, `${Date.now()}-${sanitize(file.originalname)}`),
    }),
    // 👇 type cb explicitly with (err, accept)
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const ok = allowed.has(file.mimetype) || file.mimetype.startsWith('image/')
      if (!ok) return cb(new Error('Tipo de archivo no permitido'), false)
      cb(null, true)
    },
    limits: { fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 },
  }))
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) throw new BadRequestException('Archivo requerido')
    const host = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.headers.host}`
    const dir  = process.env.UPLOAD_DIR || 'uploads'
    const url  = `${host}/${dir}/${file.filename}`
    return { url, name: file.originalname, mime: file.mimetype, size: file.size }
  }
}
