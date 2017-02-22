using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraFollow : MonoBehaviour {

    [SerializeField]
    protected GameObject player;

    protected Vector3 _initial;

	void Awake () {
        _initial = gameObject.transform.position;
	}
	
	void Update () {
        gameObject.transform.position = new Vector3(player.transform.position.x, _initial.y, _initial.z);
	}
}
