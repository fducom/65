<?php


// test to see if image folder is writable
$image_folder_writable = is_writable('/upload/');

$file       = $_FILES['file']['name'];
$filesize   = $_FILES['file']['size'];

//if the file is greater than 0, process it into resources
if($filesize > 0) {
	
	if ($image_folder_writable && isset($file)) {
    	$filename = file_name($file);
        if (strpos($filename, '.php')!==false) $filename .= '.txt'; // diffuse PHP files
        $target = '/upload/'$filename;

        if (file_exists($target)) {                                        
            $dot = strrpos($filename, '.');
            $filename_a = substr($filename, 0, $dot);
            $filename_b = substr($filename, $dot);

            $count = 1;
            while (file_exists('/upload/'file_name($filename_a.'-'.$count.$filename_b))) {
                $count++;
            }

            $filename = file_name($filename_a . '-' . $count . $filename_b);
            $target ='/upload/'.$filename;
    
        }
                                                                            
        move_uploaded_file($_FILES['file']['tmp_name'], $target);
        
        $urlpath =file_path('/upload/'.$filename);
        
        $width  = false;
        $height = false;
        $crop   = false;

        
    	if(isset($_POST['crop']) && $_POST['crop']=='true') {
    		$crop = true;
    	}
    	       	
    	
    	if(isset($_POST['width']) || isset($_POST['height'])) {
    		if(isset($_POST['width']) && $_POST['width']!='') {
    			$width = (int) $_POST['width'];
    		}

            if(isset($_POST['height']) && $_POST['height']!='') {
                $height = (int) $_POST['height'];
            }
    	}
    	
    	$MRImage = new MRImage();
    	$MRImage->resize_image($target, $width, $height, $crop);
    	
    	$urlpath = $MRImage->get_resized_filename(file_path('/upload/'.$filename),$width,$height);
    	

        
        echo stripslashes(json_safe_encode(array(
                'filelink' => $urlpath
            ))); 

	} else {
		//echo '<p class="message">Upload failed. Is the directory writable?</p>';
	}
} else {
	//echo '<p class="message">Upload failed.</p>';
}

//file_put_contents('log.txt', strip_tags(output_debug(true)));

?>