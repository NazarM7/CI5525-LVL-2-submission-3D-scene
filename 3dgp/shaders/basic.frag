// FRAGMENT SHADER
#version 330

in vec4 color;
in vec4 position;
in vec3 normal;
in vec2 texCoord0;

in vec4 shadowCoord;
uniform sampler2DShadow shadowMap;

in vec3 texCoordCubeMap;

out vec4 outColor;

// Materials
uniform vec3 materialAmbient;
uniform vec3 materialDiffuse;
uniform vec3 materialSpecular;
uniform float shininess;
uniform samplerCube textureCubeMap1;
uniform samplerCube textureCubeMap2;
uniform float reflectionPower1;
uniform float reflectionPower2;

// View Matrix
uniform mat4 matrixView;

// Texture
uniform sampler2D texture0;

uniform bool renderBAW;

struct POINT
{
int on;
vec3 position;
vec3 diffuse;
vec3 specular;
};
uniform POINT lightPoint1, lightPoint2;

vec4 PointLight(POINT light)
{
	// Calculate Directional Light
	vec4 color = vec4(0, 0, 0, 0);

	// diffuse light
	vec3 L = normalize(matrixView * vec4(light.position, 1) - position).xyz;
	float NdotL = dot(normal, L);
	if (NdotL > 0)
		color += vec4(materialDiffuse * light.diffuse, 1) * NdotL;

	// specular light
	vec3 V = normalize(-position.xyz);
	vec3 R = reflect(-L, normal);
	float RdotV = dot(R, V);
	if (NdotL > 0 && RdotV > 0)
		color += vec4(materialSpecular * light.specular * pow(RdotV, shininess), 1);

	return color;
}

const vec3 lum = vec3(0.299, 0.587, 0.114);

void main(void)
{
	outColor = color;

	outColor *= texture(texture0, texCoord0);

	// Calculation of the shadow
	float shadow = 1.0;
	if (shadowCoord.w > 0)	// if shadowCoord.w < 0 fragment is out of the Light POV
		shadow = 0.5 + 0.5 * textureProj(shadowMap, shadowCoord);
	//outColor *= shadow;

	if (lightPoint1.on == 1){
		outColor += PointLight(lightPoint1);
		outColor *= shadow;
	}

	if (renderBAW)
	{
		float baw = dot(outColor.xyz, lum);
		outColor = vec4(baw, baw,baw, 1);
	}
	
	//reflection
	//outColor = mix(outColor * texture(texture0, texCoord0.st), texture(textureCubeMap1, texCoordCubeMap), reflectionPower1);
	//outColor = mix(outColor * texture(texture0, texCoord0.st), texture(textureCubeMap2, texCoordCubeMap), reflectionPower2);

}