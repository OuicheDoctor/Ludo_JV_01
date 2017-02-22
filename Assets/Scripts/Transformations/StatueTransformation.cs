using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(menuName = "Custom/StatueTransfor")]
public class StatueTransformation : PlayerTransformation {

    public int jumpNumber = 0;

    [SerializeField]
    protected float moveSpeed = 0;
    [SerializeField]
    protected float jumpForce = 0;

    // Components
    protected Animator _animator;
    protected SpriteRenderer _renderer;
    protected Rigidbody2D _rb2D;

    protected bool _grounded = true;
    protected bool _walking = false;
    protected bool _facingRight = true;
    protected Vector2 _direction = Vector2.zero;
    protected int _jumpCount;
    protected PlayerController _player;

    public override void FixedUpdate() {
        if(_player.grounded) {
            var currentVelocity = _rb2D.velocity;
            _rb2D.velocity = new Vector2(_direction.x * this.moveSpeed, currentVelocity.y);
        }
    }

    public override void InitTransform(GameObject gameObject) {
        _renderer = gameObject.GetComponent<SpriteRenderer>();
        _renderer.sprite = defaultSprite;
        _animator = gameObject.GetComponent<Animator>();
        _animator.runtimeAnimatorController = animator;
        _rb2D = gameObject.GetComponent<Rigidbody2D>();
        _jumpCount = jumpNumber;
        _player = gameObject.GetComponent<PlayerController>();
    }

    public override void OnCollisionEnter2D(Collision2D collision) {
        if (collision.gameObject.layer == LayerMask.NameToLayer("Ground")) {
            _player.grounded = true;
            _jumpCount = jumpNumber;
        }
    }

    public override void Update() {
        
    }
}
