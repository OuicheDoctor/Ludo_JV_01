using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {

    [SerializeField]
    protected PlayerTransformation[] transformation;

    [HideInInspector]
    public bool grounded = false;

    protected PlayerTransformation currentForm; 
	
    void Start() {
        currentForm = transformation[0];
        currentForm.InitTransform(gameObject);
    }

	void Update () {
        currentForm.Update();

        if (Input.GetKeyDown(KeyCode.Joystick1Button5)) {
            currentForm = transformation[1];
            SwapForm(1);
        }
        else if (Input.GetKeyUp(KeyCode.Joystick1Button5)) {
            currentForm = transformation[0];
            SwapForm(0);
        }

        if (Input.GetKeyDown(KeyCode.Joystick1Button4)) {
            currentForm = transformation[2];
            SwapForm(2);
        }
        else if (Input.GetKeyUp(KeyCode.Joystick1Button4)) {
            currentForm = transformation[0];
            SwapForm(0);
        }
    }

    void FixedUpdate() {
        currentForm.FixedUpdate();
    }

    private void OnCollisionEnter2D(Collision2D collision) {
        currentForm.OnCollisionEnter2D(collision);
    }

    protected void SwapForm(int formIndex) {
        var form = transformation[formIndex];
        form.InitTransform(gameObject);
    }
}
