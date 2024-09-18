from gradio_client import Client, handle_file

client = Client("facebook/sapiens-depth")
file_url = 'https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'
result = client.predict(
		image=handle_file(file_url),
		depth_model_name="1b",
		seg_model_name="fg-bg-1b (recommended)",
		api_name="/process_image"
)
#
# image filepath Required
#
# The input value that is provided in the "Input Image" Image component.
#
# depth_model_name Literal['0.3b', '0.6b', '1b', '2b'] Default: "1b"
#
# The input value that is provided in the "Depth Model Size" Dropdown component.
#
# seg_model_name Literal['fg-bg-1b (recommended)', 'no-bg-removal', 'part-seg-1b'] Default: "fg-bg-1b (recommended)"
#
# The input value that is provided in the "Background Removal Model" Dropdown component.
#
# Returns tuple of 2 elements
# [0] filepath
#
# The output value that appears in the "Depth Estimation Result" Image component.
#
# [1] filepath
#
# The output value that appears in the "Output (.npy). Note: Background depth is NaN." File component.

print(result[0])
print('https://facebook-sapiens-depth.hf.space/file=')