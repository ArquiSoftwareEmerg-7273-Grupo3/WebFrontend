import { UserInfoResponse } from '../model/user-info.response';
import { IlustradorInfo, EscritorInfo } from '../model/role-specific.interfaces';

export class UserRoleUtils {
  
  static isIllustrator(user: UserInfoResponse): boolean {
    return user.ilustrador !== null && user.ilustrador !== undefined;
  }
  
  static isWriter(user: UserInfoResponse): boolean {
    return user.escritor !== null && user.escritor !== undefined;
  }
  
  static getIlustradorInfo(user: UserInfoResponse): IlustradorInfo | null {
    return this.isIllustrator(user) ? user.ilustrador! : null;
  }
  
  static getEscritorInfo(user: UserInfoResponse): EscritorInfo | null {
    return this.isWriter(user) ? user.escritor! : null;
  }
  
  static getUserRole(user: UserInfoResponse): 'ILLUSTRATOR' | 'WRITER' | 'GENERAL' {
    if (this.isIllustrator(user)) {
      return 'ILLUSTRATOR';
    } else if (this.isWriter(user)) {
      return 'WRITER';
    } else {
      return 'GENERAL';
    }
  }
  
  static getUserDisplayName(user: UserInfoResponse): string {
    return `${user.nombres} ${user.apellidos}`.trim();
  }
  
 
  
  static getUserBiography(user: UserInfoResponse): string {
    return user.descripcion;
  }
  
  static hasPremiumSubscription(user: UserInfoResponse): boolean {
    if (this.isIllustrator(user)) {
      const ilustrador = this.getIlustradorInfo(user);
      return ilustrador?.suscripcion || false;
    }
    // Los escritores no tienen campo de suscripción en el modelo actual
    return false;
  }
}