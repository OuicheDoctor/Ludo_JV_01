using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class PlayerTransformation : ScriptableObject {

    public Sprite defaultSprite;
    public RuntimeAnimatorController animator;

    public abstract void InitTransform(GameObject gameObject);
    public abstract void Update();
    public abstract void FixedUpdate();
    public abstract void OnCollisionEnter2D(Collision2D collision);

}
