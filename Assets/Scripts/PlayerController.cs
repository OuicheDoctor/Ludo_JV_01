using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {

    [SerializeField]
    protected float moveSpeed = 10;
    [SerializeField]
    protected PlayerState[] states;

    // Components
    protected Animator _animator;
    protected SpriteRenderer _renderer;
    protected Rigidbody2D _rb2D;

    protected bool _walking = false;
    protected bool _facingRight = true;
    protected Vector2 _direction = Vector2.zero;

	void Start () {
        _animator = GetComponent<Animator>();
        _renderer = GetComponent<SpriteRenderer>();
        _rb2D = GetComponent<Rigidbody2D>();
	}
	
	void Update () {
        if(Input.GetButtonDown("Fire1")) {
            SwapForm(1);
        } else if(Input.GetButtonUp("Fire1")) {
            SwapForm(0);
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

        if(xAxis > 0 && !_facingRight)
        {
            _renderer.flipX = false;
            _facingRight = true;
        }
        else if(xAxis < 0 && _facingRight) {
            _renderer.flipX = true;
            _facingRight = false;
        }
	}

    void FixedUpdate() {
        _rb2D.AddForce(_direction * moveSpeed, ForceMode2D.Force);
    }

    protected void SwapForm(int formIndex) {
        var form = states[formIndex];
        _renderer.sprite = form.defaultSprite;
        _animator.runtimeAnimatorController = form.animator;
    }
}
