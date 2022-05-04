#version 330

// Input Variables (received from Vertex Shader)
in vec2 texCoord0;

// Uniform: The Texture
uniform sampler2D texture0;
uniform float time;
uniform vec2 resolution = vec2(800, 600);

// Output Variable (sent down through the Pipeline)
out vec4 outColor;

// Vignette parameters
const float RADIUS = 0.65;
const float SOFTNESS = 0.15;

float random2d(vec2 coord){
  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) 
{
    outColor = texture(texture0, texCoord0);
	// vignette

	// Find centre position 
	vec2 centre = (gl_FragCoord.xy/ resolution.xy) - vec2(0.5);

	// Distance from the centre (between 0 and 1) 
	float dist = length(centre);

	// Hermite interpolation to create smooth vignette
	dist = smoothstep (RADIUS, RADIUS-SOFTNESS, dist);

	// mix in the vignette
	outColor.rgb = mix(outColor.rgb, outColor.rgb * dist, 0.5);

	//white noise calc
	vec2 coord = gl_FragCoord.xy / resolution.xy;
	vec3 color = vec3(0.0);
	float grain = 0.0;

	grain = random2d(vec2(sin(coord))*time);

	color = vec3(grain);
	outColor.rgb = mix(outColor.rgb, color.rgb * dist, 0.2);

	//outColor = mix(texture(texture0, texCoord0), texture(texture1, texCoord0), 0.2);
}