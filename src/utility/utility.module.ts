import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UtiliesForControllers } from 'src/utility/controllers.common';

@Module({
  providers: [UtiliesForControllers],
  imports: [UserModule],
  exports: [UtiliesForControllers],
})
export class UtilityModule {}
