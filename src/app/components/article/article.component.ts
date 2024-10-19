import { Component, Input } from '@angular/core';
import { Article } from 'src/app/interfaces';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article!: Article;
  @Input() index!: number;

  constructor(
    private iab : InAppBrowser,
    private platform:Platform,
    private actionSheetCrtl : ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
  ) { }

  openArticle(){

    if(this.platform.is('ios') || this.platform.is('android')){
    const browser = this.iab.create(this.article.url);
    browser.show();
    return;
    }

    window.open(this.article.url, '_blank');
  }

  async onOpenMenu(){

    const articleInFavorite = this.storageService.articleInFavorites(this.article);

    const normalBtns: ActionSheetButton[]=[
      {
        text: articleInFavorite ? 'Remover de Favoritos' : 'Agregar a Favoritos',
        icon: articleInFavorite ? 'heart' : 'heart-outline',
        handler: () =>this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
        cssClass: 'secondary'
      }
    ]

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () =>this.onShareArticle()
    };

    if(this.platform.is('capacitor')){
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await  this.actionSheetCrtl.create({
      header: 'Opciones',
      buttons: normalBtns
    });

    await actionSheet.present();
  }

  onShareArticle(){
    //console.log('compartir articulo');

    const{title, source, url}=this.article;

    this.socialSharing.share(
      title,
      source.name,
      undefined,
      url
    );
  }

  onToggleFavorite(){
    //console.log('Agregado a Favoritos');

    this.storageService.saveRemoveArticle(this.article);
  }

}
