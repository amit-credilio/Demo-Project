import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  public static table = 'profiles'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public gender: string

  @column()
  public mobile: string

  @column()
  public dob: Date

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
