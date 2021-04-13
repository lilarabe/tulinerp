import { Injectable } from '@angular/core';
import { App, NavController, ModalController, Modal } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { SelectPage } from '../../pages/select/select';
import { AppSwiperComponent } from './../../components/app/app-swiper/app-swiper';
import { ReadMoreComponent } from '../../components/read-more/read-more';

/**
 * 跳转 或 弹出 页面
 *
 * @export
 * @class TpProvider
 */
@Injectable()
export class TpProvider {

  private loginModal: Modal = this.modalCtrl.create(LoginPage, {}, {cssClass:'loginModal'});

  public selectModal: Modal;
  /**
   * 记录登录窗口是否打开
   * 已经打开：true   已经关闭：false
   */
  private isLoginModalActive: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private app: App,
  ) {
    /* 关闭后回调 */
    this.loginModal.onDidDismiss(() => {
      this.setLoginModalActive(false);
    });
  }

  get navCtrl(): NavController {
    return this.app.getRootNav();
  }

  private setLoginModalActive = (res: boolean): void => {
    this.isLoginModalActive = res;
  }

  public getLoginModalActive = (): boolean => {
    return this.isLoginModalActive;
  }

  /**
   * 弹出登录页
   *
   * @memberof TpProvider
   */
  public toLoginPage = async () => {
    
    if (this.isLoginModalActive === false) {
      this.isLoginModalActive = true;
      this.loginModal.present();
    }
  }

  /** 选择页 */
  public toSelectPage = (moduleName: string): void => {
    this.selectModal = this.modalCtrl.create(SelectPage, { moduleName: moduleName });
    this.selectModal.present();
  }


  /**
   * @description 图片预览 previewImageModal
   * @memberof TpProvider
   */
  public openPreviewImageModal = (imgArray: any[] = [], idx: number = 0, showMenu: any = { showDownload: false }): void => {
    const appSwiperComponent: Modal = this.modalCtrl.create(AppSwiperComponent, { imgArray: imgArray, index: idx, showMenu });
    appSwiperComponent.present();
  }

  /** 查看文本 */
  public readMoreModal = (value: string): Promise<any> => {
    return new Promise(async (resolve) => {
      const readMoreModal: Modal = this.modalCtrl.create(ReadMoreComponent, { value });
      await readMoreModal.present();
      resolve(true);
    });
  }

}
