import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const water = (() => {

  class DrinksObject {
    constructor(params) {
      this.position = new THREE.Vector3(0, 0, 0);
      this.quaternion = new THREE.Quaternion();
      this.scale = 1.0;
      this.drinks_ = []
      this.collider = new THREE.Box3();
      this.params_ = params;
      this.LoadModel_();

    }

    //load the drinks
    LoadModel_() {



      const loader = new FBXLoader();
      loader.load('./resources/Drinks/drinks.fbx', (fbx) => {
        this.mesh = fbx.children[0];
        fbx.traverse((child) => {
          if (child.isMesh) {

            child.material.map = new THREE.TextureLoader().load('./resources/Drinks/textures/drinks_albedo.jpg');

          }
        });
        this.params_.scene.add(this.mesh);


      });

    }

    UpdateCollider_() {
      this.collider.setFromObject(this.mesh);
    }

    Update() {
      if (!this.mesh) {
        return;
      }
      this.mesh.position.copy(this.position);
      this.mesh.quaternion.copy(this.quaternion);
      this.mesh.scale.setScalar(this.scale);
      this.UpdateCollider_();
    }
  }

  class DrinksManager {
    constructor(params) {
      this.objects_ = [];
      this.unused_ = [];
      this.speed_ = 12;
      this.params_ = params;
      this.counter_ = 0;
      this.visibilityCounter_ = 0
      this.spawn_ = 0;
      this.progress_ = 0;
    }

    GetColliders() {
      return this.objects_;
    }

    ToggleVisible(counter) {

      //correction if statement
      // if(counter != 0 ){
      //   counter--
      // }
      // this.objects_[counter].mesh.visible = false;
      this.objects_[0].mesh.visible = false;

    }

    SpawnObj_(position, timeElapsed) {
      this.progress_ += timeElapsed * 10.0;

      const spawnPosition = [50, 130, 210, 290, 370, 450]

      let obj = null;

      for (var i = 0; i < spawnPosition.length; i++) {
        if (this.counter_ == i) {
          obj = new DrinksObject(this.params_);

          obj.position.x = spawnPosition[i]
          obj.position.z = position[i]
          obj.scale = 0.02;
          this.objects_.push(obj);
          this.counter_++
        }
      }

    }


    Update(timeElapsed) {
      this.SpawnObj_(this.params_.position, timeElapsed)
      this.UpdateColliders_(timeElapsed);

    }

    UpdateColliders_(timeElapsed) {
      const invisible = [];
      const visible = [];

      for (let obj of this.objects_) {
        obj.position.x -= timeElapsed * this.speed_;

        if (obj.position.x < -20) {
          invisible.push(obj);
          obj.mesh.visible = false;
        } else {
          visible.push(obj);
        }

        obj.Update(timeElapsed);
      }

      this.objects_ = visible;
      this.unused_.push(...invisible);
    }


  };

  return {
    DrinksManager: DrinksManager,
  };
})();