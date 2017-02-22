using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(menuName = "Custom/SprintTransfo")]
public class SprintTransformation : PlayerTransformation {
    public int jumpNumber = 2;

    [SerializeField]
    protected float moveSpeed = 20;
    [SerializeField]
    protected float jumpForce = 10;

    // Components
    protected Animator _animator;
    protected SpriteRenderer _renderer;
    protected Rigidbody2D _rb2D;

    protected bool _walking = false;
    protected bool _facingRight = true;
    protected Vector2 _direction = Vector2.zero;
    protected int _jumpCount;
    protected PlayerController _player;

    public override void FixedUpdate() {
        var currentVelocity = _rb2D.velocity;
        _rb2D.velocity = new Vector2(_direction.x * this.moveSpeed, currentVelocity.y);
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
        if (Input.GetButtonDown("Fire1") && _jumpCount > 0) {
            _rb2D.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
            _jumpCount--;
            _player.grounded = false;
        }

        var rawXAxis = Input.GetAxis("Horizontal");
        var absRawXAxis = Mathf.Abs(rawXAxis);
        var xAxis = Mathf.Sign(rawXAxis) * Mathf.CeilToInt(absRawXAxis);
        _direction = Vector2.right * xAxis;

        if (absRawXAxis > 0.1 && !_walking) {
            _animator.SetBool("walk", true);
            _walking = true;
        }
        else if (absRawXAxis <= 0.1 && _walking) {
            _animator.SetBool("walk", false);
            _walking = false;
        }

        if (xAxis > 0 && !_facingRight) {
            _renderer.flipX = false;
            _facingRight = true;
        }
        else if (xAxis < 0 && _facingRight) {
            _renderer.flipX = true;
            _facingRight = false;
        }
    }
}
